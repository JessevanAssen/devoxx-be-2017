<template>
	<div class="talk-list">
		<div v-for="[day, slots] in days" :key="day">
			<h2>{{ day }}</h2>
			<div v-for="slot in slots">
				<h3>{{ slot.time.from.format("HH:mm") }} - {{ slot.time.to.format("HH:mm") }}</h3>
				<div class="session-list" v-for="talk of sortTalks(slot.sessions)" :key="talk.id">
					<div class="session" :class="{ favorite: isFavorite(talk.id) }">
						<div>
							<button class="star" @click="toggleFavorite(talk.id)">
								<svg viewBox="0 0 22 22">
									<polygon points="10, 1, 3.5, 22, 20, 8.5, 0, 8.5, 16.5, 22"/>
								</svg>
							</button>
							{{ talk.title }}
						</div>
						<div slot="secondary">{{ talk.speakers.map(speaker => speaker.name).join(", ") }}<br />{{ talk.room.name }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import groupBy from "lodash/groupBy";
	import sortBy from "lodash/sortBy";

	import TimeSlot from "../models/time-slot.js";

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
		name: "talk-list",
		props: {
			showOnlyFavorites: Boolean
		},
		computed: {
			talks() {
				return this.$store.state.talks;
			},
			favorites() {
				return this.$store.state.favorites;
			},
			days() {
				let talks = this.talks;
				if (this.showOnlyFavorites) {
					talks = talks.filter(talk => this.isFavorite(talk.id));
				}
				return groupByDay(talks)
					.map(([day, talks]) => [day, groupByTime(talks)]);
			}
		},
		methods: {
			sortTalks(talks) {
				return sortBy(talks, talk => talk.room.id);
			},
			isFavorite(talkId) {
				return this.favorites.indexOf(talkId) !== -1;
			},
			async toggleFavorite(talkId) {
				const action = this.isFavorite(talkId) ? "removeFavorite" : "addFavorite";
				return this.$store.dispatch(action, talkId);
			}
		}
	};
</script>

<style lang="less" scoped>
	@import (reference) url("../style/constants.less");

	.session-list {
		background-color: #ffffff;
		box-shadow: 0 -1px 0 #e0e0e0, 0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24);
	}

	.session-list > * {
		padding: 8px 16px;
	}

	.session-list > :not(:first-child) {
		border-top: 1px solid rgba(0, 0, 0, .12);
	}


	.session > :nth-child(1) {
		font-size: 16px
	}

	.session > :nth-child(2) {
		font-size: 14px;
		color: rgba(0, 0, 0, .54);
	}

	.session.favorite {
		border-left: 6px solid @color-theme;
		padding-left: 10px;
	}

	.star {
		float: right;

		padding: 0;
		border: 0;
		background: 0;
	}

	.star > svg {
		width: 24px;
		height: 24px;
	}

	.star > svg > polygon {
		fill: @color-theme;
	}

	:not(.favorite) > * > .star > svg {
		opacity: 0.4;
	}


</style>
