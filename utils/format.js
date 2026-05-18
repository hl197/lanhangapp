export const formatDate = (date, format = "YYYY-MM-DD") => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

export const getDaysRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatBookStatus = (status) => {
  const statusMap = {
    available: "可借阅",
    borrowed: "已借出",
    reserved: "已预约",
    lost: "遗失",
  };
  return statusMap[status] || status;
};

export const formatBorrowStatus = (status) => {
  const statusMap = {
    borrowing: "借阅中",
    returned: "已归还",
    overdue: "已逾期",
  };
  return statusMap[status] || status;
};

export const isOverdue = (dueDate) => {
  return getDaysRemaining(dueDate) < 0;
};
