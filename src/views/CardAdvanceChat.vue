<template>
  <b-card class="chat-widget" no-body>
    <b-card-header>
      <div class="d-flex align-items-center">
        <b-avatar
          size="34"
          :src="require('@/assets/images/avatars/1.jpg')"
          class="mr-50 badge-minimal"
          badge
          badge-variant="success"
        />
        <h5 class="mb-0">{{ nameImChattingWith }}</h5>
      </div>
      <feather-icon icon="MoreVerticalIcon" size="18" />
    </b-card-header>

    <section class="chat-app-window">
      <!-- User Chat Area -->
      <vue-perfect-scrollbar
        ref="refChatLogPS"
        :settings="perfectScrollbarSettings"
        class="user-chats scroll-area"
      >
        <chat-log
          :chat-data="chatData"
          :profile-user-avatar="require('@/assets/images/avatars/8.jpg')"
          :profile-employee-avatar="require('@/assets/images/avatars/1.jpg')"
        />
      </vue-perfect-scrollbar>

      <!-- Message Input -->
      <b-form class="chat-app-form" @submit.prevent="sendAMessage">
        <b-input-group class="input-group-merge form-send-message mr-1">
          <b-form-input
            v-model="chatInputMessage"
            placeholder="Enter your message"
          />
        </b-input-group>
        <b-button variant="primary" type="submit"> Send </b-button>
      </b-form>
    </section>
  </b-card>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BAvatar,
  BForm,
  BFormInput,
  BInputGroup,
  BButton,
} from "bootstrap-vue";

import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ChatLog from "@/views/ChatLog.vue";

import {
  getDatabase,
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
  push,
  set,
} from "firebase/database";
export default {
  components: {
    BCard,
    BCardHeader,
    BAvatar,
    BForm,
    BFormInput,
    BInputGroup,
    BButton,

    // SFC
    ChatLog,

    // 3rd party
    VuePerfectScrollbar,
  },
  props: {
    room: {
      type: String,
      required: true,
    },
    event: {
      required: true,
    },
  },
  data() {
    return {
      employeeEmail: null,
      employeeName: null,
      id: null,
      studentEmail: null,
      studentName: null,

      messagesRef: null,

      perfectScrollbarSettings: {
        maxScrollbarLength: 150,
        wheelPropagation: false,
      },

      chatInputMessage: "",
      chatData: {
        chat: {
          id: 2,
          userId: 1,
          unseenMsgs: 2,
          chat: [],
        },
        contact: {
          id: "",
          fullName: "Felecia Rower",
          // eslint-disable-next-line global-require
          avatar: require("@/assets/images/avatars/1.png"),
          status: "away",
        },
      },
    };
  },
  computed: {
    
    nameImChattingWith() {
      // console.log("this.employeeName",this.employeeName)
      // console.log("this.studentName",this.studentName)

      if (this.$store.state.user.user.SelectedStudentOrEmployee == "Student") {
        return this.employeeName;
      } else {
        return this.studentName;
      }
    },
  },
  watch: {
    event: function (val) {
      // console.log("New event value", val)
      this.employeeEmail = val.employeeEmail;
      this.employeeName = val.employeeName;
      this.id = val.id;
      this.studentEmail = val.studentEmail;
      this.studentName = val.studentName;

      if (this.$store.state.user.user.SelectedStudentOrEmployee == "Student") {
         this.chatData.contact.id = val.employeeEmail
      } else {
         this.chatData.contact.id = val.studentEmail
      }

      
      // console.log(this.employeeEmail,this.employeeName,this.id,this.studentEmail , this.studentName )
      // Subscribe for messages from database

      const db = getDatabase();
      this.messagesRef = ref(db, this.room + "/messages");
      onChildAdded(this.messagesRef, (data) => {
        this.addAMessage(JSON.parse(JSON.stringify(data)));
      });
    },
  },
  mounted() {
    this.psToBottom();
  },
  unmounted() {
    off(this.messagesRef);
  },
  methods: {
    sendAMessage() {
      // Create a new post reference with an auto-generated id
      const db = getDatabase();
      const postListRef = ref(db, this.id + "/messages");
      const newPostRef = push(postListRef);
      set(newPostRef, {
        message: this.chatInputMessage,
        senderEmail: this.$store.state.user.user.userEmail,
        senderName:
          this.$store.state.user.user.firstName +
          " " +
          this.$store.state.user.user.lastName,
        dateTime: this.formatDate(),
      });
    },

    addAMessage(newMessage) {
      // console.log("Adding a New Messsage",newMessage)
      this.chatData.chat.chat.push({
        message: newMessage.message,
        time: newMessage.dateTime,
        senderName: newMessage.senderName,
        senderEmail: newMessage.senderEmail,
        senderId: newMessage.senderEmail,
      });
      this.chatInputMessage = "";

      // Update scroll position
      // Scroll to bottom
      this.$nextTick(() => {
        this.psToBottom();
      });
    },
    formatDate() {
      var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        seconds = d.getSeconds();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day, hour, minute, seconds].join("-");
    },

    psToBottom() {
      const scrollEl = this.$refs.refChatLogPS.$el || this.$refs.refChatLogPS;
      scrollEl.scrollTop = scrollEl.scrollHeight;
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/base/pages/app-chat-list.scss";
</style>
