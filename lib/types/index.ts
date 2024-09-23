export type {
  Accountability,
  AnswerOptions,
  PracticeFrequency,
  PracticeFrequencyOptions,
  Relationship,
  RepositorySetup,
  SetupQuestion,
};

type PracticeFrequencyOptions = "every_day" | "once_a_week" | "once_a_month";

type PracticeFrequency = {
  value: PracticeFrequencyOptions;
  display: "Every day" | "Once a week" | "Once a month";
};

type Accountability = {
  value: boolean;
  display: "Yes please" | "I'll pass";
};

type AnswerOptions = PracticeFrequency | Accountability;

type SetupQuestion = {
  id: string;
  question: string;
  description: string;
  options: AnswerOptions[];
};

type RepositorySetup = {
  id: string;
  title: string;
  description: string;
  steps: { title: string; code: React.ReactElement | string }[];
};

type Relationship = {
  id: string;
  type: string;
};
