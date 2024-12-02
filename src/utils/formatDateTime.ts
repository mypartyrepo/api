const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);

  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = date
    .toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(':', 'h');

  return { date: formattedDate, time: formattedTime };
};

export default formatDateTime;
