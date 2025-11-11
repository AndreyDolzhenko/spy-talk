const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Conversation.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    client: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Conversation',
    // hooks: {
    //   afterCreate: async (conversation, options) => {
    //     try {
    //       // Отправляем уведомление всем подключенным клиентам с этим user_id
    //       notifyUsers(conversation.user_id, 'newConversation', {
    //         message: `Новая запись добавлена для user_id: ${conversation.user_id}`,
    //         conversation: {
    //           id: conversation.id,
    //           user_id: conversation.user_id,
    //           content: conversation.content,
    //           client: conversation.client,
    //           createdAt: conversation.createdAt
    //         },
    //         timestamp: new Date().toISOString()
    //       });
          
    //       console.log(`✅ Notification sent for new conversation (id: ${conversation.id}, user_id: ${conversation.user_id})`);
    //     } catch (error) {
    //       console.error('❌ Error sending notification:', error);
    //     }
    //   }
    // }
  });

  return Conversation;
};


///////////////////

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Conversation extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       Conversation.belongsTo(models.User, { foreignKey: "user_id" });	 
//     }
//   }
//   Conversation.init({
//     content: DataTypes.STRING,
//     client: DataTypes.INTEGER,    
//   }, {
//     sequelize,
//     modelName: 'Conversation',
//   });
//   return Conversation;
// };

