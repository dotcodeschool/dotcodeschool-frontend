export async function generateMetadata() {
  const title = `Dot Code School | Learn Blockchain & Web3 Development Fast`;
  const description = `Learn to build web3 applications and custom blockchains using the Polkadot SDK. Master blockchain development through hands-on learning with our interactive courses!`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://dotcodeschool.com/courses`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
