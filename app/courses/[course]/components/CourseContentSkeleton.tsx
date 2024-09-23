import {
  Box,
  Skeleton,
  SkeletonText,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  SkeletonCircle,
} from "@chakra-ui/react";
import React from "react";

function CourseContentSkeleton() {
  return (
    <Box maxW="4xl" mx="auto">
      <Skeleton height="40px" width="80%" my={4} />
      <Skeleton height="20px" width="40%" mb={6} />

      <SkeletonText mt={4} noOfLines={3} spacing={4} skeletonHeight="4" />

      <HStack mt={4} spacing={2}>
        <Skeleton height="24px" width="60px" />
        <Skeleton height="24px" width="80px" />
      </HStack>

      <Skeleton height="48px" width="120px" mt={8} />

      <Box
        bg="gray.700"
        border="2px solid"
        borderColor="gray.600"
        shadow="2xl"
        my={12}
        p={8}
        rounded={16}
      >
        <Skeleton height="28px" width="60%" mb={6} />
        <VStack align="stretch" spacing={4}>
          {[...Array(4)].map((_, index) => (
            <HStack key={index}>
              <SkeletonCircle height="20px" width="20px" />
              <Skeleton height="20px" width="80%" />
            </HStack>
          ))}
        </VStack>
      </Box>

      <Skeleton height="32px" width="40%" my={8} />
      <Skeleton height="20px" width="30%" mb={8} />

      <Accordion allowToggle>
        {[...Array(3)].map((_, index) => (
          <AccordionItem key={index}>
            <AccordionButton py={6}>
              <VStack spacing={4} w="full" align="start">
                <HStack w="full">
                  <Skeleton height="24px" width="80%" />
                  <Skeleton height="24px" width="24px" />
                </HStack>
                <Skeleton height="8px" width="90%" />
              </VStack>
            </AccordionButton>
            <AccordionPanel pb={12} w="90%" pt={0}>
              <SkeletonText
                mt={4}
                noOfLines={3}
                spacing={4}
                skeletonHeight="4"
              />
              <Skeleton height="40px" width="120px" mt={12} />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}

export default CourseContentSkeleton;
