export const formatToClientDate = (date?: string) => {
	if (!date) {
		return '';
	}
	return new Date(date).toLocaleDateString();
};
