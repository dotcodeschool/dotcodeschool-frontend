export async function generateMetadata() {
  const title = `Browse Courses | Dot Code School`;
  const description = `Learn to build your own blockchain, web3 applications, and more using the Polkadot SDK. Browse our free and open source courses to find the one that's right for you!`;
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
