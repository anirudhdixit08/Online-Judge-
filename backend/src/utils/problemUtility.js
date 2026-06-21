import axios from "axios";

export const getLanguageById = (language) => {
  const languages = {
    "c++": 54,
    'java': 62,
    'javascript' : 63,
    'c': 50,
    'python': 109,
  };
  return languages[language.trim()];
};

async function fetchData(options) {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Compiler service request failed", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
}

const waiting = (timer) =>
  new Promise((resolve) => setTimeout(resolve, timer));

const COMPILER_BASE_URL = process.env.COMPILER_BASE_URL || "http://localhost:8000";
const judge0BatchUrl = `${COMPILER_BASE_URL}/submissions/batch`;

export const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: judge0BatchUrl,
    params: {
      base64_encoded: "false",
    },
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": process.env.MY_COMPILER_SECRET,
    },
    data: { submissions },
  };

  const result = await fetchData(options);
  if (!Array.isArray(result)) {
    throw new Error("Compiler service did not return submission tokens.");
  }

  return result;
};

export const submitToken = async (resultTokens) => {
  const options = {
    method: "GET",
    url: judge0BatchUrl,
    params: {
      tokens: resultTokens.join(","),
      base64_encoded: "false",
      fields: "*",
    },
  };

  while(true){
    const result = await fetchData(options);
    if (!result?.submissions?.length) {
      await waiting(500);
      continue;
    }

    if(result.submissions.every((r)=> r.status_id>2))
        return result.submissions;

    await waiting (500); // this is like polling as we have done in online compiler project.
  }
};
