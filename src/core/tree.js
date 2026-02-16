export function getActiveThread(conversation) {
  if (!conversation.chat_messages || conversation.chat_messages.length === 0) {
    return [];
  }

  const messageMap = new Map();
  for (const msg of conversation.chat_messages) {
    messageMap.set(msg.uuid, msg);
  }

  const thread = [];
  let currentUuid = conversation.current_leaf_message_uuid;

  while (currentUuid) {
    const message = messageMap.get(currentUuid);
    if (!message) break;

    thread.unshift(message);
    currentUuid = message.parent_message_uuid;
  }

  return thread;
}
