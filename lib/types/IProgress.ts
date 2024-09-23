export interface IProgressUpdate {
  user: {
    email: string;
  };
  progress: IProgressData;
}

export interface IProgressData {
  [courseId: string]: {
    [lessonId: string]: {
      [chapterId: string]: boolean;
    };
  };
}
