import { Progress, Text } from "@chakra-ui/react";

export default function ProgressBar({
  numOfCompletedLessons,
  numOfLessons,
}: {
  numOfCompletedLessons: number;
  numOfLessons: number;
}) {
  const progress = (numOfCompletedLessons / numOfLessons) * 100;

  return (
    <>
      <Progress
        colorScheme="green"
        w="full"
        value={progress}
        size="sm"
        rounded="full"
      />
      <Text fontSize="sm" fontWeight="500" color="gray.400">
        {progress}% Complete
      </Text>
    </>
  );
}
