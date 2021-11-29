<template>
  <div class="chats">
    <div
      v-for="(msgGrp, index) in formattedChatData.formattedChatLog"
      :key="msgGrp.sender + index"
      class="chat"
      :class="{ 'chat-left': msgGrp.sender == formattedChatData.contact.id }"
    >
      <div class="chat-avatar">
        <b-avatar
          size="36"
          class="avatar-border-2 box-shadow-1"
          variant="transparent"
          :src="
            msgGrp.sender === formattedChatData.contact.id
              ? profileEmployeeAvatar
              : profileUserAvatar
          "
        />
      </div>
      <div class="chat-body">
        <div
          v-for="(msgData, index) in msgGrp.messages"
          class="chat-content"
          :key="msgData.msg + index"
        >
          <div v-if="msgData.file">
            Filename: <b>{{ msgData.fileName }}</b>
            <a :href="msgData.url" target="_blank" download=""
              ><feather-icon icon="DownloadIcon" size="25"
            /></a>
            <br />
            <embed :src="msgData.url" height="100" />
            <br />
          </div>
          <p v-else>{{ msgData.msg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
import { BAvatar } from "bootstrap-vue";

export default {
  components: {
    BAvatar,
  },
  props: {
    chatData: {
      type: Object,
      required: true,
    },
    profileUserAvatar: {
      type: String,
      required: true,
    },
    profileEmployeeAvatar: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const formattedChatData = computed(() => {
      const contact = {
        id: props.chatData.contact.id,
        avatar: props.chatData.contact.avatar,
      };

      let chatLog = [];
      if (props.chatData.chat) {
        chatLog = props.chatData.chat.chat;
      }

      const formattedChatLog = [];
      let chatMessageSender = chatLog[0] ? chatLog[0].sender : undefined;
      let msgGroup = {
        sender: chatMessageSender,
        messages: [],
      };

      chatLog.forEach((msg, index) => {
        if (chatMessageSender === msg.sender) {
          msgGroup.messages.push({
            msg: msg.message,
            url: msg.fileURL,
            fileName: msg.fileName,
            file: msg.file,
            time: msg.time,
          });
        } else {
          chatMessageSender = msg.sender;
          formattedChatLog.push(msgGroup);
          msgGroup = {
            sender: msg.sender,
            messages: [
              {
                msg: msg.message,
                url: msg.fileURL,
                fileName: msg.fileName,
                file: msg.file,
                time: msg.time,
              },
            ],
          };
        }
        if (index === chatLog.length - 1) formattedChatLog.push(msgGroup);
      });

      return {
        formattedChatLog,
        contact,
        profileUserAvatar: props.profileUserAvatar,
        profileEmployeeAvatar: props.profileEmployeeAvatar,
      };
    });

    return {
      formattedChatData,
    };
  },
};
</script>

<style>
</style>
