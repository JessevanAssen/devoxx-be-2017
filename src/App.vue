<template>
	<div v-cloak>
		<header>Devoxx BE 2017</header>
		<section class="content">
			<div v-for="[day, slots] in days" :key="day">
				<h2>{{ day }}</h2>
				<div v-for="slot in slots">
					<h3>{{ slot.time.from.format("HH:mm") }} - {{ slot.time.to.format("HH:mm") }}</h3>
					<list-card v-for="session of sortTalks(slot.sessions)" :key="session.talk.id">
						<list-card-item>
							<div>{{ session.talk.title }}</div>
							<div slot="secondary">{{ session.talk.speakers.join(", ") }}<br />{{ session.room.roomName }}</div>
						</list-card-item>
					</list-card>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";

import TimeSlot from "./models/time-slot.js";

import listCard from "./components/list-card.vue";
import listCardItem from "./components/list-card-item.vue";


const groupByDay = input => {
	const grouped = groupBy(input, talk => talk.time.from.format("d"));
	return sortBy(Object.entries(grouped), entry => entry[0])
		.map(([, talks]) => [talks[0].time.from.format("dddd"), talks]);
};

const groupByTime = slots => {
	const sorted = [...slots].sort((a, b) => TimeSlot.compare(a.time, b.time));

	const groups = [];

	for (let slot of sorted) {
		if (groups.length === 0 || !groups[groups.length - 1].time.equals(slot.time)) {
			groups.push({
				time: slot.time,
				sessions: []
			});
		}

		groups[groups.length - 1].sessions.push(slot);
	}

	return groups;
};

export default {
	name: "app",
	computed: {
		talks() {
			return this.$store.state.talks;
		},
		days() {
			return groupByDay(this.talks)
				.map(([day, talks]) => [day, groupByTime(talks)]);
		}
	},
	methods: {
		sortTalks(talks) {
			return sortBy(talks, talk => talk.room.id);
		}
	},
	async mounted() {
		this.$store.dispatch("loadTalks");
	},
	components: {
		listCard,
		listCardItem
	}
};
</script>

<style lang="less">
	@import (reference) url("./style/constants.less");

	@font-face {
		font-family: "Open Sans";
		font-style: normal;
		font-weight: 400;
		src: local("Open Sans Regular"), local("OpenSans-Regular"), url("./fonts/OpenSans-Regular.ttf");
	}

	@font-face {
		font-family: "Open Sans";
		font-style: normal;
		font-weight: 700;
		src: local("Open Sans Bold"), local("OpenSans-Bold"), url("./fonts/OpenSans-Bold.ttf");
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: "Open Sans"
	}

	body {
		background-color: @color-background;
		color: @color-primary;
	}

	h2 {
		font-size: 22px;
		margin: 16px 16px 8px;
		color: rgba(0, 0, 0, .75);
		font-weight: normal;
	}

	h3 {
		font-size: 16px;
		margin: 16px 16px 8px;
		color: rgba(0, 0, 0, .54);
		font-weight: normal;
	}
</style>

<style lang="less" scoped>
	@import (reference) url("./style/constants.less");

	[v-cloak] {
		display: none;
	}

	header {
		background-color: @color-theme;
		font-size: 20px;
		font-weight: bold;
		padding: 16px;
		color: white;
		box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
	}

	.content {
		padding-top: 60px;
	}

	.details {
		background-color: white;
		padding-top: 60px;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
</style>

