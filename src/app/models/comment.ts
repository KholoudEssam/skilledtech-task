export interface Comment {
  body: string;
  createdAt?: timeStamp;
  addedBy: string;
}

interface timeStamp {
  seconds: number;
}
