"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { ObjectId } from "mongodb";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { User } from "@/lib/db/models/users";
import {
  AnswerOptions,
  PracticeFrequencyOptions,
  SetupQuestion,
} from "@/lib/types";

import { SetupStep } from "./SetupStep";

interface CreateRepoRequest {
  repo_template: string;
  user_id: ObjectId;
  expected_practice_frequency: PracticeFrequencyOptions;
  is_reminders_enabled: boolean;
}

export default function StepsComponent({
  questions,
  repositorySetup,
  startingLessonUrl,
  courseSlug,
}: {
  questions: SetupQuestion[];
  repositorySetup: {
    id: string;
    title: string;
    description: string;
    steps: { title: string; code: React.ReactElement | string }[];
  };
  startingLessonUrl: string;
  courseSlug: string;
}) {
  const { data } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showRepositorySetup, setShowRepositorySetup] = useState(false);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [gitPushReceived, setGitPushReceived] = useState(false);

  async function createRepository(updatedAnswers: {
    [key: string]: boolean | PracticeFrequencyOptions;
  }) {
    if (!data) {
      return;
    }
    const getUserResponse = await axios.get("/api/get-user", {
      params: {
        user: data?.user,
      },
    });
    const user: User = getUserResponse.data;
    if (!user?._id) {
      return;
    }
    const req: CreateRepoRequest = {
      repo_template: courseSlug,
      user_id: user._id,
      expected_practice_frequency: updatedAnswers[
        "practice_frequency"
      ] as PracticeFrequencyOptions,
      is_reminders_enabled: updatedAnswers["accountability"] as boolean,
    };

    const response = await axios.post("/api/create-repository", req, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      // Update the user's repositories
      console.log(response);
    } else {
      // TODO: add proper error handling to provide user feedback
      console.error("Failed to create repository");
    }
    setLoadingRepo(false);
  }

  const handleOptionClick = (option: AnswerOptions) => {
    const updatedAnswers = {
      ...answers,
      [questions[currentStep].id]: option.value,
    };
    setAnswers(updatedAnswers);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoadingRepo(true);
      setShowRepositorySetup(true);
      createRepository(updatedAnswers);
    }
  };

  // Simulate receiving a git push after 10 seconds
  if (showRepositorySetup) {
    setTimeout(() => {
      setLoadingRepo(false);
    }, 2000);
    setTimeout(() => {
      setGitPushReceived(true);
    }, 10000);
  }

  const currentQuestion = questions[currentStep];

  return (
    <Card maxW="lg" width="full" mx="auto" mt={24}>
      <CardHeader>
        <Heading size="lg">Course Setup</Heading>
      </CardHeader>
      <CardBody>
        {!showRepositorySetup ? (
          <SetupStep step={currentQuestion} onOptionClick={handleOptionClick} />
        ) : (
          <SetupStep
            step={repositorySetup}
            isRepositorySetup={true}
            isLoading={loadingRepo}
            gitPushReceived={gitPushReceived}
            startingLessonUrl={startingLessonUrl}
          />
        )}
      </CardBody>
      <CardFooter justifyContent="space-between">
        <Text fontSize="sm" color="gray.500">
          {!showRepositorySetup
            ? `Step ${currentStep + 1} of ${questions.length}`
            : "Final Step"}
        </Text>
      </CardFooter>
    </Card>
  );
}
