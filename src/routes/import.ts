import { FastifyPluginAsync } from "fastify";
import { createContext } from '../lib/client/context';

const pulseImport: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/import', async function (req, reply) {
    const context = await createContext();
    const response = await req;
    const { body }: any = response;

    // Metric type for data I'm creating
    type Metric = {
      uniqueKey: string,
      metricTimeStamp: string,
      name: string,
      unit: string,
      qty: number
    }

    let dataToSend: Metric = {
      uniqueKey: '',
      metricTimeStamp: '',
      name: '',
      unit: '',
      qty: 0
    };

    const getMetrics = body.data.metrics.map((metric: any) => {
      const metricData = metric.data.map((datum: any) => {
        const adjustedDate = new Date(`${datum.date}`).toISOString().split('T')[0];

        return {
          ...dataToSend,
          uniqueKey: `${adjustedDate}-${metric.name}`,
          name: metric.name,
          unit: metric.units,
          metricTimeStamp: datum.date,
          qty: datum.qty
        }
      });

      return metricData;
    });

    const flattenedMetrics = getMetrics.flat();

    await flattenedMetrics.map(async (metric: Metric) => {
      try {
        await context.prisma.metric.upsert({
          where: {
            uniqueKey: metric.uniqueKey
          },
          update: {
            name: metric.name,
            unit: metric.unit,
            metricTimeStamp: metric.metricTimeStamp,
            qty: metric.qty
          },
          create: {
            uniqueKey: metric.uniqueKey,
            name: metric.name,
            unit: metric.unit,
            metricTimeStamp: metric.metricTimeStamp,
            qty: metric.qty
          }
        });
      } catch (error) {
        console.log(error);
      }
    });

    return flattenedMetrics;
  })
}
export default pulseImport;
