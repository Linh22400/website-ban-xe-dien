export default {
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to submit a trade-in request');
    }

    const {
      VehicleBrand,
      VehicleModel,
      VehicleYear,
      VehicleType,
      Condition,
      Mileage,
      BatteryHealth,
      HasAccidents,
      HasModifications,
      AdditionalNotes,
      Photos,
      ContactPhone,
      ContactEmail,
      PreferredContactMethod
    } = ctx.request.body.data;

    // Validate required fields
    if (!VehicleBrand || !VehicleModel || !VehicleYear || !VehicleType || !Condition || !Mileage || !ContactPhone || !ContactEmail) {
      return ctx.badRequest('Missing required fields');
    }

    // Calculate estimated value based on condition and battery health
    const estimatedValue = calculateEstimatedValue({
      VehicleYear,
      Condition,
      Mileage,
      BatteryHealth,
      HasAccidents,
      HasModifications
    });

    try {
      // @ts-ignore
      const tradeIn = await strapi.entityService.create('api::trade-in.trade-in', {
        data: {
          Customer: user.id,
          VehicleBrand,
          VehicleModel,
          VehicleYear,
          VehicleType,
          Condition,
          Mileage,
          BatteryHealth,
          HasAccidents,
          HasModifications,
          AdditionalNotes,
          Photos,
          EstimatedValue: estimatedValue,
          Status: 'pending',
          ContactPhone,
          ContactEmail,
          PreferredContactMethod
        },
        populate: ['Customer', 'Photos']
      });

      return ctx.send({
        data: tradeIn,
        message: 'Trade-in request submitted successfully'
      });
    } catch (error) {
      console.error('Trade-in creation error:', error);
      return ctx.internalServerError('Failed to create trade-in request');
    }
  },

  async findByUser(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    try {
      // @ts-ignore
      const tradeIns = await strapi.entityService.findMany('api::trade-in.trade-in', {
        filters: {
          Customer: user.id
        },
        populate: ['Photos', 'Order'],
        sort: { createdAt: 'desc' }
      });

      return ctx.send({ data: tradeIns });
    } catch (error) {
      console.error('Error fetching user trade-ins:', error);
      return ctx.internalServerError('Failed to fetch trade-ins');
    }
  },

  async updateAppraisal(ctx) {
    const { id } = ctx.params;
    const { AppraisedValue, AppraisalNotes, Status } = ctx.request.body.data;

    if (!AppraisedValue || !Status) {
      return ctx.badRequest('Appraised value and status are required');
    }

    try {
      // @ts-ignore
      const updated = await strapi.entityService.update('api::trade-in.trade-in', id, {
        data: {
          AppraisedValue,
          AppraisalNotes,
          Status
        },
        populate: ['Customer', 'Photos']
      });

      // TODO: Send notification to customer about appraisal result
      
      return ctx.send({ data: updated });
    } catch (error) {
      console.error('Error updating appraisal:', error);
      return ctx.notFound('Trade-in request not found');
    }
  }
};

// Helper function to calculate estimated trade-in value
function calculateEstimatedValue({
  VehicleYear,
  Condition,
  Mileage,
  BatteryHealth,
  HasAccidents,
  HasModifications
}: {
  VehicleYear: number;
  Condition: string;
  Mileage: number;
  BatteryHealth: number;
  HasAccidents: boolean;
  HasModifications: boolean;
}): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - VehicleYear;

  // Base value (adjust based on your market)
  let baseValue = 10000000; // 10 million VND

  // Age depreciation (10% per year, max 50%)
  const ageDepreciation = Math.min(vehicleAge * 0.1, 0.5);
  baseValue *= (1 - ageDepreciation);

  // Condition multiplier
  const conditionMultipliers = {
    excellent: 1.0,
    good: 0.85,
    fair: 0.65,
    poor: 0.45
  };
  baseValue *= conditionMultipliers[Condition as keyof typeof conditionMultipliers] || 0.85;

  // Mileage deduction (1% per 1000 km over 5000 km)
  if (Mileage > 5000) {
    const excessMileage = Mileage - 5000;
    const mileageDeduction = Math.min((excessMileage / 1000) * 0.01, 0.3);
    baseValue *= (1 - mileageDeduction);
  }

  // Battery health (critical for electric vehicles)
  const batteryMultiplier = BatteryHealth / 100;
  baseValue *= batteryMultiplier;

  // Accidents deduction
  if (HasAccidents) {
    baseValue *= 0.8;
  }

  // Modifications (can be positive or negative, we'll be conservative)
  if (HasModifications) {
    baseValue *= 0.9;
  }

  return Math.round(baseValue);
}
