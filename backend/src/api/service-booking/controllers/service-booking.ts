export default {
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to book a service');
    }

    const {
      ServiceType,
      AppointmentDate,
      VehicleBrand,
      VehicleModel,
      VehiclePlateNumber,
      IssueDescription,
      Priority,
      ContactPhone,
      ContactEmail,
      PreferredShowroom,
      ServiceImages
    } = ctx.request.body.data;

    // Validate required fields
    if (!ServiceType || !AppointmentDate || !VehicleBrand || !VehicleModel || !IssueDescription || !ContactPhone || !ContactEmail) {
      return ctx.badRequest('Missing required fields');
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(AppointmentDate);
    if (appointmentDateTime < new Date()) {
      return ctx.badRequest('Appointment date must be in the future');
    }

    // Estimate cost based on service type
    const estimatedCost = getEstimatedCost(ServiceType);

    try {
      // @ts-ignore
      const booking = await strapi.entityService.create('api::service-booking.service-booking', {
        data: {
          Customer: user.id,
          ServiceType,
          AppointmentDate,
          VehicleBrand,
          VehicleModel,
          VehiclePlateNumber,
          IssueDescription,
          Priority: Priority || 'medium',
          Status: 'pending',
          ContactPhone,
          ContactEmail,
          PreferredShowroom,
          EstimatedCost: estimatedCost,
          ServiceImages
        },
        populate: ['Customer', 'PreferredShowroom', 'ServiceImages']
      });

      // TODO: Send confirmation email/SMS

      return ctx.send({
        data: booking,
        message: 'Service booking created successfully'
      });
    } catch (error) {
      console.error('Service booking creation error:', error);
      return ctx.internalServerError('Failed to create service booking');
    }
  },

  async findByUser(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    try {
      // @ts-ignore
      const bookings = await strapi.entityService.findMany('api::service-booking.service-booking', {
        filters: {
          Customer: user.id
        },
        populate: ['PreferredShowroom', 'ServiceImages', 'Order'],
        sort: { AppointmentDate: 'desc' }
      });

      return ctx.send({ data: bookings });
    } catch (error) {
      console.error('Error fetching user service bookings:', error);
      return ctx.internalServerError('Failed to fetch service bookings');
    }
  },

  async updateStatus(ctx) {
    const { id } = ctx.params;
    const { Status, TechnicianNotes, ActualCost, CompletionNotes, PartsReplaced } = ctx.request.body.data;

    if (!Status) {
      return ctx.badRequest('Status is required');
    }

    try {
      const updateData: any = {
        Status,
        TechnicianNotes,
        ActualCost,
        CompletionNotes,
        PartsReplaced
      };

      if (Status === 'completed') {
        updateData.CompletedAt = new Date();
      }

      // @ts-ignore
      const updated = await strapi.entityService.update('api::service-booking.service-booking', id, {
        data: updateData,
        populate: ['Customer', 'PreferredShowroom', 'ServiceImages']
      });

      // TODO: Send notification to customer about status change

      return ctx.send({ data: updated });
    } catch (error) {
      console.error('Error updating service booking:', error);
      return ctx.notFound('Service booking not found');
    }
  },

  async submitFeedback(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { id } = ctx.params;
    const { Rating, CustomerFeedback } = ctx.request.body.data;

    if (!Rating) {
      return ctx.badRequest('Rating is required');
    }

    try {
      // @ts-ignore
      const booking = await strapi.entityService.findOne('api::service-booking.service-booking', id, {
        populate: ['Customer']
      });

      if (!booking) {
        return ctx.notFound('Service booking not found');
      }

      // @ts-ignore
      if (booking.Customer.id !== user.id) {
        return ctx.forbidden('You can only rate your own service bookings');
      }

      // @ts-ignore
      const updated = await strapi.entityService.update('api::service-booking.service-booking', id, {
        data: {
          Rating,
          CustomerFeedback
        }
      });

      return ctx.send({ data: updated });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return ctx.internalServerError('Failed to submit feedback');
    }
  },

  async getAvailableSlots(ctx) {
    const { date, showroomId } = ctx.query;

    if (!date) {
      return ctx.badRequest('Date is required');
    }

    try {
      // Get all bookings for the specified date and showroom
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);

      const filters: any = {
        AppointmentDate: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        Status: {
          $ne: 'cancelled'
        }
      };

      if (showroomId) {
        filters.PreferredShowroom = showroomId;
      }

      // @ts-ignore
      const bookings = await strapi.entityService.findMany('api::service-booking.service-booking', {
        filters,
        fields: ['AppointmentDate']
      });

      // Generate available time slots (9 AM - 5 PM, hourly slots)
      const allSlots = [];
      for (let hour = 9; hour < 17; hour++) {
        const slotTime = new Date(startOfDay);
        slotTime.setHours(hour, 0, 0, 0);
        allSlots.push(slotTime.toISOString());
      }

      // Filter out booked slots
      const bookedSlots = bookings.map((b: any) => new Date(b.AppointmentDate).toISOString());
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      return ctx.send({
        data: {
          date,
          showroomId,
          availableSlots,
          bookedSlots
        }
      });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return ctx.internalServerError('Failed to fetch available slots');
    }
  }
};

// Helper function to estimate service cost
function getEstimatedCost(serviceType: string): number {
  const costs = {
    maintenance: 200000, // 200k VND
    repair: 500000, // 500k VND
    'battery-replacement': 3000000, // 3M VND
    inspection: 100000, // 100k VND
    warranty: 0, // Free under warranty
    emergency: 800000 // 800k VND
  };

  return costs[serviceType as keyof typeof costs] || 0;
}
