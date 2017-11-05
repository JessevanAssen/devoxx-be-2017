import moment from "moment";

export default class TimeSlot {
	constructor(from, to) {
		this.from = moment(from);
		this.to = moment(to);
	}

	equals(other) {
		return this.from.isSame(other.from) && this.to.isSame(other.to);
	}

	static compare(first, second) {
		if (first.from.isBefore(second.from))
			return -1;
		if (first.from.isAfter(second.from))
			return 1;
		if (first.to.isBefore(second.to))
			return -1;
		if (first.to.isAfter(second.to))
			return 1;
		return 0;
	}
}