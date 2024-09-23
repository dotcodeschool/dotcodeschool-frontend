import { Button, ChakraProps } from "@chakra-ui/react";

interface PrimaryButtonProps extends ChakraProps {
  as?: React.ElementType;
  href?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
}

function PrimaryButton({ children, ...props }: PrimaryButtonProps) {
  return (
    <Button colorScheme="green" color="gray.800" {...props}>
      {children}
    </Button>
  );
}

export default PrimaryButton;
