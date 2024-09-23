import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Footer } from "@/components/Footer";
import Navbar from "@/components/navbar";
import PrimaryButton from "@/components/primary-button";

export { generateMetadata } from "./metadata";

const Home = () => (
  <Box maxW="8xl" mx="auto" px={[4, 12]}>
    <Navbar />
    <Header />
    <FeaturesList />
    <Stack align="center" mt={20} pb={20} spacing={8}>
      <Heading as="h2" fontWeight="800" size="2xl">
        Ready to get started?
      </Heading>
      <LandingCTA />
    </Stack>
    <Footer />
  </Box>
);

export default Home;

const Header = () => (
  <Stack align="center" mt={20} pb={20} textAlign="center">
    <Heading as="h1" fontWeight="800" maxW="3xl" size="4xl">
      Learn to Code Web3 Apps by Building Real Projects.
    </Heading>
    <Text fontSize="xl" maxW="3xl" mb={20} mt={4}>
      Dot Code School is an interactive online school that teaches you how to
      build meaningful web3 applications using the Polkadot SDK. Learn how to
      build your own custom blockchain from zero to one hundred.
    </Text>
    <LandingCTA />
  </Stack>
);

const LandingCTA = () => (
  <ButtonGroup
    flexWrap={{
      base: "wrap",
      md: "nowrap",
    }}
    spacing={{
      base: 0,
      md: 4,
    }}
  >
    <PrimaryButton
      _hover={{ textDecor: "none" }}
      as={Link}
      fontSize="xl"
      href="/courses"
      mb={{
        base: 4,
        md: 0,
      }}
      p={8}
      w={{
        base: "full",
        md: "auto",
      }}
    >
      Browse Courses
    </PrimaryButton>
    <Button
      _hover={{ textDecor: "none" }}
      as={Link}
      colorScheme="gray"
      fontSize="xl"
      href="https://forms.gle/2o4hBauCJ6Fkf9Zz7"
      isExternal
      p={8}
      variant="solid"
      w={{
        base: "full",
        md: "auto",
      }}
    >
      Become a Teacher
    </Button>
  </ButtonGroup>
);

type FeatureComponentProps = {
  title: string | React.JSX.Element;
  description: string | React.JSX.Element;
  image: string;
  alt?: string;
  isImageFirst?: boolean;
  cta?: React.JSX.Element;
};

const FeatureComponent = ({
  title,
  description,
  image,
  alt,
  isImageFirst,
  cta,
}: FeatureComponentProps) => (
  <Stack
    align="center"
    direction={isImageFirst ? ["column", "row-reverse"] : ["column", "row"]}
    mt={20}
    pb={20}
    spacing={8}
  >
    <Box w={["100%", "50%"]}>
      <Heading as="h1" fontWeight="800" size="2xl">
        {title}
      </Heading>
      <Text mt={4}>{description}</Text>
      {cta ? cta : null}
    </Box>
    <Box w={["100%", "50%"]}>
      <Image alt={alt} src={image} />
    </Box>
  </Stack>
);

const FeaturesList = () => (
  <Stack spacing={8}>
    <FeatureComponent
      alt="Interactive Learning"
      description={
        <>
          The most respected engineers don&apos;t just read about technology —
          they build it.
          <br />
          <br />
          Improve the depth of your understanding by building real projects with
          in-browser step-by-step interactive lessons.
        </>
      }
      image="/static/images/interface.png"
      title={
        <>
          Ditch the Docs.
          <br />
          Code the Blocks.
        </>
      }
    />
    <FeatureComponent
      alt="Expert Instructors"
      description="Our courses are created by industry experts who have first-hand experience building web3 applications and working in the blockchain industry."
      image="/static/images/experts.png"
      isImageFirst
      title="Learn directly from experts"
    />
  </Stack>
);
