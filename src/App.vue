<template>
	<div v-cloak>
		<header>Devoxx BE 2017
			<button class="toggle-favorites" @click="toggleShowOnlyFavorites" :class="{ active: showOnlyFavorites }">
				<svg viewBox="0 0 22 22">
					<polygon points="10, 1, 3.5, 22, 20, 8.5, 0, 8.5, 16.5, 22"/>
				</svg>
			</button>
		</header>
		<section class="content">
			<talk-list :show-only-favorites="showOnlyFavorites"></talk-list>
		</section>
	</div>
</template>

<script>
	import talkList from "./components/talk-list.vue";

	export default {
		name: "app",
		data() {
			return {
				showOnlyFavorites: false
			};
		},
		methods: {
			toggleShowOnlyFavorites() {
				this.showOnlyFavorites = !this.showOnlyFavorites;
			}
		},
		mounted() {
			this.$store.dispatch("loadTalks");
			this.$store.dispatch("loadFavorites");
		},
		components: {
			talkList
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
		z-index: 100;
	}

	.content {
		padding-top: 60px;
	}

	.toggle-favorites {
		border: 0;
		padding: 0;
		background: 0;

		float: right;
	}

	.toggle-favorites > svg {
		width: 24px;
		height: 24px;
	}

	.toggle-favorites > svg > polygon {
		fill: lighten(@color-theme, 20%);
	}

	.toggle-favorites.active > svg > polygon {
		fill: darken(@color-theme, 20%);
		border: 1px solid black;
	}
</style>

