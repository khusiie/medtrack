function createChatHistory(chats) {
  const chatHistory = {};

  for (let i = 0; i < chats.length; i += 2) {
    const llm_question = chats[i]?.message;
    const user_answer = chats[i + 1]?.message;

    chatHistory[llm_question] = user_answer;
  }

  return chatHistory;
}

module.exports = {
  createChatHistory,
};
