const get = async url => {
	const response = await fetch(url);
	if (!response.ok) {
		throw response;
	}
	return response.json();
};

const getDay = async day => {
	const { slots } = await get(`https://cfp.devoxx.be/api/conferences/DVBE17/schedules/${day}`);
	return slots.filter(slot => slot.talk);
};

export const getWednesday = () => getDay("wednesday");
export const getThursday = () => getDay("thursday");
export const getFriday = () => getDay("friday");

export const getRooms = async () => {
	const rooms = await get("https://cfp.devoxx.be/api/conferences/DVBE17/rooms/");
	return rooms.rooms;
};