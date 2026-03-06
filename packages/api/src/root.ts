import { createTRPCRouter } from "./trpc";
import { practiceRouter } from "./routers/practice";
import { providersRouter } from "./routers/providers";
import { clientsRouter } from "./routers/clients";
import { appointmentsRouter } from "./routers/appointments";
import { chartingRouter } from "./routers/charting";
import { photosRouter } from "./routers/photos";
import { billingRouter } from "./routers/billing";
import { inventoryRouter } from "./routers/inventory";
import { formsRouter } from "./routers/forms";
import { servicesRouter } from "./routers/services";
import { telehealthRouter } from "./routers/telehealth";

export const appRouter = createTRPCRouter({
  practice: practiceRouter,
  providers: providersRouter,
  clients: clientsRouter,
  appointments: appointmentsRouter,
  charting: chartingRouter,
  photos: photosRouter,
  billing: billingRouter,
  inventory: inventoryRouter,
  forms: formsRouter,
  services: servicesRouter,
  telehealth: telehealthRouter,
});

export type AppRouter = typeof appRouter;
