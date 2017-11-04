<template>
	<div class="list">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "list-card"
	};
</script>

<style lang="less" scoped>
	@import (reference) url("../style/constants.less");

	.list {
		background-color: #ffffff;
		box-shadow: 0 -1px 0 #e0e0e0, 0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24);
	}

	.list > * {
		padding: 8px 16px;
	}

	.list > .favorite {
		border-left: 6px solid var(--color-theme);
		padding-left: 10px;
	}

	.list > :not(:first-child) {
		border-top: 1px solid rgba(0, 0, 0, .12);
	}
</style>
