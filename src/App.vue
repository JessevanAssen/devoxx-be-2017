<template>
	<div v-cloak>
		<header>Devoxx BE 2017</header>
		<section class="content">
			<div v-for="day in days" :key="day.day">
				<h2>{{ day.day }}</h2>
				<div v-for="slot in day.slots">
					<h3>{{ time(slot.from) }} - {{ time(slot.to) }}</h3>
					<list-card v-for="session of slot.sessions" :key="session.talk.id">
						<list-card-item>
							<div>{{ session.talk.title }}</div>
							<div slot="secondary">{{ session.talk.speakers.map(speaker => speaker.name).join(", ") }}</div>
						</list-card-item>
					</list-card>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import listCard from "./components/list-card.vue";
import listCardItem from "./components/list-card-item.vue";

import sortBy from "lodash/sortBy";
import moment from "moment";


const groupByTime = slots => {
	slots = slots.filter(x => x.talk);
	const sorted = sortBy(slots, [slot => slot.fromTimeMillis, slot => slot.toTimeMillis]);

	const groups = [];

	for (let slot of sorted) {
		if (groups.length === 0 || groups[groups.length - 1].from !== slot.fromTimeMillis || groups[groups.length - 1].to !== slot.toTimeMillis) {
			groups.push({
				from: slot.fromTimeMillis,
				to: slot.toTimeMillis,
				sessions: []
			});
		}

		groups[groups.length - 1].sessions.push(slot);
	}

	return groups;
};

const getDay = async day => {
	const response = await fetch(`https://cfp.devoxx.be/api/conferences/DVBE17/schedules/${day}`);
	if (!response.ok) {
		throw response;
	}

	const { slots } = await response.json();

	return groupByTime(slots);
};

export default {
	name: "app",
	data () {
		return {
			days: []
		};
	},
	methods: {
		time(input) {
			return moment(input).format("HH:mm");
		}
	},
	async mounted() {
		const [wednesday, thursday, friday] = await Promise.all([
			getDay("wednesday"), getDay("thursday"), getDay("friday")
		]);

		this.days.push(...[
			{
				day: "Wednesday",
				slots: wednesday
			},
			{
				day: "Thursday",
				slots: thursday
			},
			{
				day: "Friday",
				slots: friday
			}
		]);
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

