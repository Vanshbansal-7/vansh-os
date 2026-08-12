export type ApplicationStatus =
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Offer Received'
  | 'Withdrawn';

export type ApplicationMode =
  | 'On Campus'
  | 'Off Campus'
  | 'Referral'
  | 'LinkedIn'
  | 'Careers Page';

export interface CompanyDocument {
  id: string;
  name: string;
  thumbnail_url: string;
  type: string;
}

export interface CompanyApplication {
  id: string;
  company_name: string;
  logo_url: string;
  role: string;
  applied_date: string;
  application_mode: ApplicationMode;
  job_link?: string;
  status: ApplicationStatus;
  location: string;
  notes?: string;
  documents: CompanyDocument[];
}
