import Vue from "vue";
import Vuex from "vuex";

import * as gateway from "./gateway.js";
import TimeSlot from "../models/time-slot.js";

Vue.use(Vuex);

const sanitize = slots => slots
	.filter(slot => !!slot.talk)
	.map(slot => ({
		id: slot.slotId,
		time: new TimeSlot(slot.fromTimeMillis, slot.toTimeMillis),
		room: {
			id: slot.roomId,
			roomName: slot.roomName,
			roomCapacity: slot.roomCapacity
		},
		talk: {
			id: slot.talk.id,
			title: slot.talk.title,
			speakers: slot.talk.speakers.map(speaker => speaker.name)
		}
	}));

export default new Vuex.Store({
	state: {
		talks: []
	},
	mutations: {
		setTalks(state, talks) {
			state.talks.splice(0, state.talks.length);
			state.talks.push(...talks);
		}
	},
	actions: {
		async loadTalks(context) {
			const [wednesday, thursday, friday] = await Promise.all([gateway.getWednesday(), gateway.getThursday(), gateway.getFriday()]);
			const all = [...wednesday, ...thursday, ...friday];
			context.commit("setTalks", sanitize(all));
		}
	}
});
