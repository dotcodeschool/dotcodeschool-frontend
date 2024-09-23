"use client";

import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { FaTwitter, FaDiscord } from "react-icons/fa";

import Navbar from "@/components/navbar";
import { slugToTitleCase } from "@/lib/utils";
import successAnimation from "@/public/static/successAnimation.json";

function SuccessPage({ params: { course } }: { params: { course: string } }) {
  const courseTitle = slugToTitleCase(course);
  const tweetText = encodeURIComponent(
    `I just completed the ${courseTitle} course on @dotcodeschool.\n\nNow, I am one step closer to building my own blockchain on @Polkadot.`,
  );

  const lottieContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [textOpacity, setTextOpacity] = useState(0);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) {
      const audio = new Audio("/static/successSound.mp3");
      audio.oncanplaythrough = () => {
        if (lottieContainerRef.current) {
          lottieContainerRef.current.style.opacity = "1";
        }
        audio.play();
      };
      setTimeout(() => {
        setTextOpacity(1);
      }, 1500);
    } else {
      if (lottieContainerRef.current) {
        lottieContainerRef.current.style.opacity = "1";
      }
      setTextOpacity(1);
    }
  }, []);

  return (
    <Box textAlign="center" px={[6, 12]} pb={24}>
      <Navbar cta={false} />
      <VStack maxW="4xl" mx="auto" mt={[-10, 12]}>
        <Box opacity={0} ref={lottieContainerRef} transition="opacity 6s">
          <Lottie
            animationData={successAnimation}
            style={{ cursor: "default", height: 400 }}
          />
        </Box>
        <Text
          opacity={textOpacity}
          fontFamily="fantasy"
          fontSize="2xl"
          fontWeight="900"
          mt={-8}
          transition="opacity 2s"
        >
          Achievement Unlocked!
        </Text>
        <Text
          fontSize="lg"
          opacity={textOpacity}
          transition="opacity 1s"
          transitionDelay="0.5s"
          maxW="lg"
        >
          Congratulations! You have successfully completed the {courseTitle}{" "}
          course. You&apos;re officially one step closer to building your own
          blockchain on Polkadot.
        </Text>
        <VStack
          opacity={textOpacity}
          transition="opacity 0.5s"
          transitionDelay="4s"
          mt={8}
        >
          <VStack spacing={4} mb={8}>
            <Button
              as={Link}
              leftIcon={<FaTwitter />}
              href={`https://twitter.com/intent/tweet?text=${tweetText}`}
              bg="white"
              color="gray.800"
              w="full"
              size="lg"
              _hover={{
                bg: "gray.200",
                textDecoration: "none",
              }}
              px={12}
              isExternal
            >
              Tweet Your Achievement
            </Button>
          </VStack>
          <ButtonGroup spacing={4}>
            <IconButton
              as={Link}
              href="https://twitter.com/intent/user?screen_name=dotcodeschool"
              aria-label="Follow us on Twitter"
              colorScheme="twitter"
              variant="outline"
              size="lg"
              opacity={textOpacity}
              transition="opacity 0.5s"
              transitionDelay="4s"
              isExternal
            >
              <FaTwitter />
            </IconButton>
            <IconButton
              as={Link}
              href="https://discord.gg/Z6QBZ886Bq"
              aria-label="Join us on Discord"
              colorScheme="purple"
              variant="outline"
              size="lg"
              isExternal
            >
              <FaDiscord />
            </IconButton>
          </ButtonGroup>
          <Text fontStyle="italic" fontSize="sm" mt={8} mb={2} color="gray.400">
            We have more content coming soon... Stay tuned!
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}

export default SuccessPage;
