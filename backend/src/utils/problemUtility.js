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
    console.error(error);
  }
}

const waiting = async(timer) => {
    setTimeout(()=> {
        return 1;
    },timer);
}

export const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: { submissions },
  };

  return await fetchData(options);
};

export const submitToken = async (resultTokens) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultTokens.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  while(true){
    const result = await fetchData(options);
    let isResultObtained = result.submissions.every((r)=> r.status_id>2);
    if(isResultObtained)
        return result.submissions;
    await waiting (500); // this is like polling as we have done in online compiler project.
  }
};
