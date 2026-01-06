export default {
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { Type, Title, Message, Link, Data } = ctx.request.body.data;

    if (!Type || !Title || !Message) {
      return ctx.badRequest('Type, Title, and Message are required');
    }

    try {
      // @ts-ignore
      const notification = await strapi.entityService.create('api::notification.notification', {
        data: {
          User: user.id,
          Type,
          Title,
          Message,
          Link,
          Data,
          IsRead: false
        },
        populate: ['User']
      });

      return ctx.send({ data: notification });
    } catch (error) {
      console.error('Error creating notification:', error);
      return ctx.internalServerError('Failed to create notification');
    }
  },

  async findByUser(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { page = 1, pageSize = 20, unreadOnly = false } = ctx.query;

    try {
      const filters: any = {
        User: user.id
      };

      if (unreadOnly === 'true') {
        filters.IsRead = false;
      }

      // @ts-ignore
      const notifications = await strapi.entityService.findMany('api::notification.notification', {
        filters,
        sort: { createdAt: 'desc' },
        start: (Number(page) - 1) * Number(pageSize),
        limit: Number(pageSize)
      });

      // @ts-ignore
      const total = await strapi.entityService.count('api::notification.notification', { filters });

      return ctx.send({
        data: notifications,
        meta: {
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            pageCount: Math.ceil(total / Number(pageSize)),
            total
          }
        }
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return ctx.internalServerError('Failed to fetch notifications');
    }
  },

  async markAsRead(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { id } = ctx.params;

    try {
      // @ts-ignore
      const notification = await strapi.entityService.findOne('api::notification.notification', id, {
        populate: ['User']
      });

      if (!notification) {
        return ctx.notFound('Notification not found');
      }

      // @ts-ignore
      if (notification.User.id !== user.id) {
        return ctx.forbidden('You can only mark your own notifications as read');
      }

      // @ts-ignore
      const updated = await strapi.entityService.update('api::notification.notification', id, {
        data: { IsRead: true }
      });

      return ctx.send({ data: updated });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return ctx.internalServerError('Failed to mark notification as read');
    }
  },

  async markAllAsRead(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    try {
      // @ts-ignore
      const unreadNotifications = await strapi.entityService.findMany('api::notification.notification', {
        filters: {
          User: user.id,
          IsRead: false
        }
      });

      // Update all unread notifications
      // @ts-ignore
      await Promise.all(
        unreadNotifications.map((notification: any) =>
          // @ts-ignore
          strapi.entityService.update('api::notification.notification', notification.id, {
            data: { IsRead: true }
          })
        )
      );

      return ctx.send({ 
        message: `${unreadNotifications.length} notifications marked as read`,
        count: unreadNotifications.length
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return ctx.internalServerError('Failed to mark notifications as read');
    }
  },

  async getUnreadCount(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    try {
      // @ts-ignore
      const count = await strapi.entityService.count('api::notification.notification', {
        filters: {
          User: user.id,
          IsRead: false
        }
      });

      return ctx.send({ count });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return ctx.internalServerError('Failed to get unread count');
    }
  },

  async deleteNotification(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { id } = ctx.params;

    try {
      // @ts-ignore
      const notification = await strapi.entityService.findOne('api::notification.notification', id, {
        populate: ['User']
      });

      if (!notification) {
        return ctx.notFound('Notification not found');
      }

      // @ts-ignore
      if (notification.User.id !== user.id) {
        return ctx.forbidden('You can only delete your own notifications');
      }

      // @ts-ignore
      await strapi.entityService.delete('api::notification.notification', id);

      return ctx.send({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      return ctx.internalServerError('Failed to delete notification');
    }
  }
};

// Define notification types
type NotificationType = 
  | 'order-created'
  | 'order-confirmed'
  | 'order-shipped'
  | 'order-delivered'
  | 'order-cancelled'
  | 'service-confirmed'
  | 'service-reminder'
  | 'service-completed'
  | 'trade-in-appraised'
  | 'trade-in-accepted'
  | 'promotion'
  | 'review-response'
  | 'maintenance-reminder'
  | 'general';

// Helper function to create notification
export async function createNotification(
  userId: number,
  type: NotificationType,
  title: string,
  message: string,
  options: {
    link?: string;
    orderId?: number;
    serviceId?: number;
    tradeInId?: number;
    data?: any;
  } = {}
) {
  try {
    // @ts-ignore
    const notification = await strapi.entityService.create('api::notification.notification', {
      data: {
        User: userId,
        Type: type,
        Title: title,
        Message: message,
        Link: options.link,
        RelatedOrder: options.orderId,
        RelatedService: options.serviceId,
        RelatedTradeIn: options.tradeInId,
        Data: options.data,
        IsRead: false
      }
    });

    // TODO: Send email notification if user preferences allow
    // await sendEmailNotification(notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}
