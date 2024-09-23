Dot Code School is an interactive online school that teaches you how to build meaningful web3 applications using the Polkadot SDK. This project aims to onboard newcomer developers to build their own custom blockchain from zero to one hundred.

The tutorial builds upon the raw content written by [Shawn Tabrizi](https://github.com/shawntabrizi), available on the [rust-state-machine](https://github.com/shawntabrizi/rust-state-machine) repo.

## Interactive Learning Interface

<img src="https://github.com/iammasterbrucewayne/dotcodeschool/assets/93382017/7ce6282e-ab8c-45ed-bd4f-93699806595f" alt="dotcodeschool interactive coding interface" width="600px" />

## Development (WARNING: The guide hasn't been updated with latest changes!)

<details>
<summary>TBD: Update README with latest breaking changes</summary>
- Document new project structure, the current thought process, known inconsistencies, issues, bugs
- Update documentation with latest content models
- Update contribution guidelines (linting, formatting, committing, issue templates, PR templates, etc.)
</details>
This is a [Next.js](https://nextjs.org/) project that uses the Contentful API for hosting the tutorials.

Before starting, you'll need to setup the following content models on Contentful:

```js
{
  author: {
    name, // Short Text
    url, // Short Text
  },
  courseModule: {
    moduleName, // Short text
    author, // Reference
    moduleDescription, // Long text
    level, // Short text
    language, // Short text
    sections, // References, many
    slug, // Short text
  },
  files: {
    title, // Short text
    source, // Media, many files
    template, // Media, many files
    solution, // Media, many files
  },
  lesson: {
    lessonName, // Short text
    lessonContent, // Long text
    lessonDescription, // Long text
    files, // Reference
  },
  section: {
    title, // Short text
    description, // Long text
    lessons, // References, many
  },
}
```

Once you've set up the content models, start by cloning this repo:

```bash
git clone https://github.com/dotcodeschool/frontend.git
```

Make sure you're in the right working directory:

```bash
cd frontend
```

Next, you will need to set up your local environment with the following variables:

```env
# Contentful API
CONTENTFUL_SPACE_ID="<your_contentful_space_id>"
CONTENTFUL_ENVIRONMENT="<your_contentful_environment>"
CONTENTFUL_ACCESS_TOKEN="<your_contentful_access_token>"

# User Auth
AUTH_SECRET="<your_secret>"

AUTH_GITHUB_ID="<your_github_client_id>"
AUTH_GITHUB_SECRET="<your_github_client_secret>"

# Database
MONGODB_URI="<your_mongodb_uri>"
```

To start the development server, simply run:

```bash
yarn dev
```

Or, build a docker image and run the project inside a container:

```bash
docker build . -t dotcodeschool-frontend:latest && docker run -p 3000:3000 dotcodeschool-frontend:latest
```

Open [http://localhost:3000](http://localhost:3000) on your browser to interact with the UI locally.

## Deploy on Vercel

The easiest way to deploy your the app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
