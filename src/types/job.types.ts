export type IJob = {
  _id: string;
  userId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  link: string;
  status: number;
  order: number;
  custom_resume_link?: string;
  interview_date?: string;
  contract_link?: string;
};
