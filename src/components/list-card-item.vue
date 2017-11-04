<template>
	<div class="list-card-item">
		<slot></slot>
		<slot name="secondary"></slot>
	</div>
</template>

<script>
	export default {
		name: "list-card"
	};
</script>

<style lang="less" scoped>
	@import (reference) url("../style/constants.less");

	.list-card-item > :nth-child(1) {
		font-size: 16px
	}

	.list-card-item > :nth-child(2) {
		font-size: 14px;
		color: rgba(0, 0, 0, .54);
	}
</style>
