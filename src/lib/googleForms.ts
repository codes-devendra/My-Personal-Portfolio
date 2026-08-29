import { getAccessToken } from './googleAuth';

export interface FormSummary {
  id: string;
  name: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  responderUri?: string;
}

export interface FormItem {
  itemId: string;
  title: string;
  description?: string;
  questionItem?: {
    question: {
      questionId: string;
      required?: boolean;
      textQuestion?: {
        paragraph?: boolean;
      };
      choiceQuestion?: {
        type: string;
        options: { value: string }[];
      };
    };
  };
}

export interface FormDetails {
  formId: string;
  info: {
    title: string;
    documentTitle?: string;
    description?: string;
  };
  settings?: Record<string, unknown>;
  items?: FormItem[];
  revisionId?: string;
  responderUri?: string;
}

export interface FormResponseAnswer {
  questionId: string;
  textAnswers?: {
    answers: { value: string }[];
  };
}

export interface FormResponseItem {
  responseId: string;
  createTime: string;
  lastSubmittedTime?: string;
  answers?: Record<string, FormResponseAnswer>;
}

export interface FormResponsesList {
  responses?: FormResponseItem[];
  nextPageToken?: string;
}

/**
 * Fetch all Google Forms owned/accessible by the user via Drive API
 */
export async function listUserGoogleForms(): Promise<FormSummary[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated. Please sign in with Google.');

  const query = encodeURIComponent("mimeType = 'application/vnd.google-apps.form' and trashed = false");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,createdTime,modifiedTime,webViewLink,iconLink)&orderBy=modifiedTime desc&pageSize=20`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch forms: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Get detailed structure of a specific form
 */
export async function getGoogleForm(formId: string): Promise<FormDetails> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated. Please sign in with Google.');

  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to get form details: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Get all responses for a form
 */
export async function getGoogleFormResponses(formId: string): Promise<FormResponsesList> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated. Please sign in with Google.');

  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to get form responses: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Create a new intake or feedback Google Form with pre-populated questions
 */
export async function createPortfolioGoogleForm(templateType: 'discovery' | 'feedback' | 'consultation' | 'custom', customTitle?: string): Promise<FormDetails> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated. Please sign in with Google.');

  let title = customTitle || 'Project Discovery & Scope Intake';
  let description = 'Please share your technical requirements, estimated timeline, and project goals.';

  if (templateType === 'feedback') {
    title = customTitle || 'Client Experience & Collaboration Feedback';
    description = 'Your candid feedback helps refine engineering quality and client delivery.';
  } else if (templateType === 'consultation') {
    title = customTitle || 'Engineering Consultation Briefing';
    description = 'Brief questionnaire to help prepare for our upcoming architectural consultation.';
  }

  // 1. Create the base form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: {
        title,
        documentTitle: title
      }
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create form: ${createRes.statusText}`);
  }

  const createdForm: FormDetails = await createRes.json();
  const formId = createdForm.formId;

  // 2. Build questions batch update
  const requests: unknown[] = [
    {
      updateFormInfo: {
        info: {
          description
        },
        updateMask: 'description'
      }
    }
  ];

  if (templateType === 'discovery') {
    requests.push(
      {
        createItem: {
          item: {
            title: 'What is your project or product name?',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false }
              }
            }
          },
          location: { index: 0 }
        }
      },
      {
        createItem: {
          item: {
            title: 'What is the primary objective or scope of work?',
            description: 'E.g. Full-stack web app, API integration, performance optimization',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: true }
              }
            }
          },
          location: { index: 1 }
        }
      },
      {
        createItem: {
          item: {
            title: 'Estimated Budget Range',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: '< $5,000' },
                    { value: '$5,000 - $15,000' },
                    { value: '$15,000 - $35,000' },
                    { value: '$35,000+' }
                  ]
                }
              }
            }
          },
          location: { index: 2 }
        }
      },
      {
        createItem: {
          item: {
            title: 'Target Launch Deadline',
            questionItem: {
              question: {
                required: false,
                textQuestion: { paragraph: false }
              }
            }
          },
          location: { index: 3 }
        }
      }
    );
  } else if (templateType === 'feedback') {
    requests.push(
      {
        createItem: {
          item: {
            title: 'How satisfied are you with the technical delivery?',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: '5 - Exceptional' },
                    { value: '4 - Exceeded Expectations' },
                    { value: '3 - Met Requirements' },
                    { value: '2 - Needs Improvement' }
                  ]
                }
              }
            }
          },
          location: { index: 0 }
        }
      },
      {
        createItem: {
          item: {
            title: 'What went especially well during the engagement?',
            questionItem: {
              question: {
                required: false,
                textQuestion: { paragraph: true }
              }
            }
          },
          location: { index: 1 }
        }
      }
    );
  } else {
    requests.push(
      {
        createItem: {
          item: {
            title: 'Contact Name & Email',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false }
              }
            }
          },
          location: { index: 0 }
        }
      },
      {
        createItem: {
          item: {
            title: 'Topic / Questions for Consultation',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: true }
              }
            }
          },
          location: { index: 1 }
        }
      }
    );
  }

  // 3. Send batchUpdate
  const batchRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });

  if (!batchRes.ok) {
    const err = await batchRes.json().catch(() => ({}));
    console.warn('Batch update notice:', err);
  }

  return await getGoogleForm(formId);
}
