import moment from "moment";
import Vue from "vue";
import Vuex from "vuex";

import uniqBy from "lodash/uniqBy";

import * as gateway from "./gateway.js";
import DB from "./db.js";
import TimeSlot from "../models/time-slot.js";

Vue.use(Vuex);

const db = new DB();

const flatten = input => input.reduce((acc, i) => acc.concat(i), []);

const extractRooms = slots => uniqBy(
	slots.map(slot => ({
		id: slot.roomId,
		capacity: slot.roomCapacity,
		name: slot.roomName,
		setup: slot.roomSetup
	})),
	room => room.id);

const extractSpeakers = slots => uniqBy(
	flatten(
		slots.map(slot => slot.talk.speakers
			.map(speaker => ({
				id: speaker.link.href.slice(-40),
				name: speaker.name
			}))
		)
	),
	speaker => speaker.id
);

const extractTalks = slots => slots
	.filter(slot => !!slot.talk)
	.map(slot => ({
		id: slot.talk.id,
		title: slot.talk.title,
		speakerIds: slot.talk.speakers.map(speaker => speaker.link.href.slice(-40)),
		time: { from: moment(slot.fromTimeMillis).toISOString(), to: moment(slot.toTimeMillis).toISOString() },
		roomId: slot.roomId
	}));

const groupById = list => list.reduce((acc, i) => Object.assign(acc, { [i.id]: i }), {});

const merge = (rooms, speakers, talks) => {
	const roomsGrouped = groupById(rooms);
	const speakersGrouped = groupById(speakers);

	return talks.map(talk => ({
		id: talk.id,
		title: talk.title,
		speakers: talk.speakerIds.map(id => speakersGrouped[id]),
		room: roomsGrouped[talk.roomId],
		time: new TimeSlot(talk.time.from, talk.time.to)
	}));
};

export default new Vuex.Store({
	state: {
		talks: [],
		favorites: []
	},
	mutations: {
		setTalks(state, talks) {
			state.talks.splice(0, state.talks.length);
			state.talks.push(...talks);
		},
		setFavorites(state, favorites) {
			state.favorites.splice(0, state.favorites.length);
			state.favorites.push(...favorites);
		},
		addFavorite(state, talkId) {
			state.favorites.push(talkId);
		},
		removeFavorite(state, talkId) {
			const index = state.favorites.indexOf(talkId);
			state.favorites.splice(index, 1);
		}
	},
	actions: {
		async loadTalks(context) {
			const dataLoaded = await db.getProperty("data_loaded");
			if (dataLoaded) {
				const [rooms, speakers, talks] = await Promise.all([
					db.getRooms(),
					db.getSpeakers(),
					db.getTalks()
				]);
				context.commit("setTalks", merge(rooms, speakers, talks));
			} else {
				const slots = flatten(await Promise.all([gateway.getWednesday(), gateway.getThursday(), gateway.getFriday()]));
				const rooms = extractRooms(slots);
				const speakers = extractSpeakers(slots);
				const talks = extractTalks(slots);

				context.commit("setTalks", merge(rooms, speakers, talks));

				await db.storeData(rooms, speakers, talks);
				await db.setProperty("data_loaded", true);
			}
		},

		async loadFavorites(context) {
			const favorites = await db.getFavorites();
			context.commit("setFavorites", favorites);
		},
		async addFavorite(context, talkId) {
			context.commit("addFavorite", talkId);
			db.addFavorite(talkId);
		},
		async removeFavorite(context, talkId) {
			context.commit("removeFavorite", talkId);
			db.removeFavorite(talkId);
		}
	}
});
