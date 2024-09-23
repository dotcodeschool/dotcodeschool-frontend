import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";

import PrimaryButton from "@/components/primary-button";
import { AnswerOptions, RepositorySetup, SetupQuestion } from "@/lib/types";

interface SetupStepProps {
  step: SetupQuestion | RepositorySetup;
  onOptionClick?: (option: AnswerOptions) => void;
  isLoading?: boolean;
  isRepositorySetup?: boolean;
  gitPushReceived?: boolean;
  startingLessonUrl?: string;
}

function RepoSetupStep({
  title,
  code,
}: {
  title: string;
  code: React.ReactElement | string;
}) {
  return (
    <Box bg="gray.800" p={4} borderRadius="md" w="full">
      <Heading size="sm" mb={2}>
        {title}
      </Heading>
      {code}
    </Box>
  );
}

export const SetupStep: React.FC<SetupStepProps> = ({
  step,
  onOptionClick,
  isLoading,
  isRepositorySetup = false,
  gitPushReceived = false,
  startingLessonUrl,
}) => {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Heading size="md" mb={2}>
        {isRepositorySetup
          ? (step as RepositorySetup).title
          : (step as SetupQuestion).question}
      </Heading>
      <Text color="gray.400" mb={6}>
        {!isLoading
          ? step.description
          : "We're setting up your repository... It shouldn't take too long."}
      </Text>
      {!isRepositorySetup ? (
        <VStack spacing={4}>
          {(step as SetupQuestion).options?.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              width="full"
              justifyContent="flex-start"
              height="auto"
              py={3}
              px={4}
              _hover={{ bg: "gray.800", color: "white" }}
              onClick={() => onOptionClick && onOptionClick(option)}
            >
              {option.display}
            </Button>
          ))}
        </VStack>
      ) : isLoading ? (
        <VStack minH={48} h="full" w="full" justify="center" align="start">
          <Skeleton
            height={8}
            startColor="gray.700"
            endColor="gray.500"
            width="75%"
          />
          <Skeleton
            height={16}
            startColor="gray.700"
            endColor="gray.500"
            width="100%"
          />
          <Skeleton
            mt={6}
            height={8}
            startColor="gray.700"
            endColor="gray.500"
            width="50%"
          />
          <Skeleton
            height={16}
            startColor="gray.700"
            endColor="gray.500"
            width="100%"
          />
        </VStack>
      ) : (
        <VStack spacing={6} alignItems="start" w="full">
          {(
            step as {
              steps: { title: string; code: React.ReactElement | string }[];
            }
          ).steps.map((repoStep, index) => (
            <RepoSetupStep
              key={index}
              title={repoStep.title}
              code={repoStep.code}
            />
          ))}
          <HStack
            gap={1}
            w="full"
            bg="whiteAlpha.100"
            color="blue.300"
            p={4}
            borderRadius="md"
            fontWeight="500"
          >
            {gitPushReceived ? (
              <>
                <HiOutlineCheckCircle height="20px" width="20px" />
                <Text>
                  Git push received! The first stage is now activated.
                </Text>
              </>
            ) : (
              <>
                <Spinner mr={2} size="sm" speed="0.8s" />
                <Text>Listening for a git push...</Text>
              </>
            )}
          </HStack>
          {gitPushReceived && startingLessonUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PrimaryButton w="full" as="a" href={startingLessonUrl}>
                Continue
              </PrimaryButton>
            </motion.div>
          )}
        </VStack>
      )}
    </motion.div>
  );
};
