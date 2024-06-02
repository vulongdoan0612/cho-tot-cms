import { format } from 'date-fns';

const formatDate = (inputDateString: any) => {
  const originalDate = new Date(inputDateString);

  return format(originalDate, 'dd-MM-yyyy');
};

export default formatDate;
