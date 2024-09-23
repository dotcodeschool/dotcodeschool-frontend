"use client";

import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import { Highlight, themes, Token } from "prism-react-renderer";
import { Key, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { IPreComponentProps } from "@/lib/types/IPreComponentProps";

function PreComponent({ children }: { children: IPreComponentProps }) {
  const [isHovered, setIsHovered] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const code = children.props.children.trim();
  const language = children.props.className
    ? children.props.className.replace("language-", "")
    : "rust";

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Highlight theme={themes.dracula} code={code} language={language}>
        {({
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }: {
          className: string;
          style: React.CSSProperties;
          tokens: Token[][];
          getLineProps: (props: { line: Token[]; key?: Key }) => {
            className: string;
            style?: React.CSSProperties;
            key?: Key;
          };
          getTokenProps: (props: { token: Token; key?: Key }) => {
            className: string;
            style?: React.CSSProperties;
            children: string;
          };
        }) => (
          <Box
            as="pre"
            style={style}
            overflowX="auto"
            py={4}
            px={6}
            rounded={8}
            sx={{
              "::-webkit-scrollbar": {
                height: "6px",
                borderRadius: "8px",
              },
              "::-webkit-scrollbar-thumb": {
                height: "6px",
                borderRadius: "8px",
              },
              ":hover::-webkit-scrollbar-thumb": { background: "gray.700" },
            }}
          >
            <Box pr={12}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </Box>
          </Box>
        )}
      </Highlight>
      {(isHovered || copySuccess) && (
        <CopyToClipboard text={code} onCopy={() => setCopySuccess(true)}>
          <IconButton
            as={copySuccess ? CheckIcon : CopyIcon}
            aria-label="Copy code to clipboard"
            position="absolute"
            top={3}
            right={3}
            size="sm"
            p={2}
            color={copySuccess ? "green.200" : "gray.400"}
            cursor={copySuccess ? "default" : "pointer"}
            _hover={{ color: "gray.200", bg: "gray.600" }}
          />
        </CopyToClipboard>
      )}
    </Box>
  );
}

export default PreComponent;
