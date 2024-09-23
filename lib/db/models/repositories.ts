import { ObjectId } from "mongodb";

import { PracticeFrequencyOptions, Relationship } from "../types";

export interface Repository {
  _id?: ObjectId;
  repo_name: string;
  repo_template: string;
  tester_url: string;
  relationships: Array<Relationship>;
  expected_practice_frequency: PracticeFrequencyOptions;
  is_reminders_enabled: boolean;
}
