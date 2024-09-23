import { Box } from "@chakra-ui/react";
import axios from "axios";
import { isNil } from "lodash";
import { MDXComponents as MDXComponentsType } from "mdx/types";
import { redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { auth } from "@/auth";
import MDXComponents from "@/components/lessons-interface/mdx-components";
import Navbar from "@/components/navbar";
import { questions as questionsData, repositorySetup } from "@/lib/db/data";
import { handleSignIn } from "@/lib/middleware/actions";
import { SetupQuestion } from "@/lib/types";
import { findRepo } from "@/lib/utils";

import StepsComponent from "./components/Steps";

export default async function SetupPage({
  params,
}: {
  params: { course: string };
}) {
  const { course } = params;
  const session = await auth();
  if (!session) {
    await handleSignIn({
      redirectTo: `/courses/${course}/setup`,
    });
  }
  const getUserResponse = await axios.get(
    "http://localhost:3000/api/get-user",
    {
      params: {
        user: session?.user,
      },
    },
  );
  const userId = getUserResponse.data._id;
  const repo = await findRepo(course, userId);
  const hasEnrolled = !isNil(repo);
  if (!hasEnrolled) {
    return redirect(`/courses/${course}/lesson/1/chapter/1`); // TODO: this should redirect to the last lesson the user was on or the first lesson if they haven't started
  }
  // convert the code in steps array in questions data's isCustom to serialized code
  const serializedRepositorySetup = {
    ...repositorySetup,
    steps: await Promise.all(
      repositorySetup.steps.map(async (step) => {
        return {
          ...step,
          code: (
            <MDXRemote
              source={step.code}
              components={MDXComponents as Readonly<MDXComponentsType>}
            />
          ),
        };
      }),
    ),
  };
  return (
    <Box maxW="6xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <StepsComponent
        questions={questionsData as SetupQuestion[]}
        repositorySetup={serializedRepositorySetup}
        startingLessonUrl={`/courses/${course}/lesson/1/chapter/1`}
        courseSlug={course}
      />
    </Box>
  );
}
