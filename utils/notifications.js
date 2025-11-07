// const { userConnections } = require('../index');

// const notifyUsers = (userId, event, data) => {
//   if (userConnections && userConnections.has(userId)) {
//     const sockets = userConnections.get(userId);
//     sockets.forEach((socketId) => {
//       // io нужно импортировать или передавать как параметр
//       const { io } = require('../index');
//       io.to(socketId).emit(event, data);
//     });
//     console.log(
//       `📢 Notification sent to ${sockets.size} clients for user ${userId}`
//     );
//   }
// };

// module.exports = { notifyUsers };