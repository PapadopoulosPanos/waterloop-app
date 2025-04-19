import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-2 px-4">
        <h2 className="font-medium text-xl mb-2">Our Mission</h2>
        <p>
          Our mission is to promote water conservation via innovative solutions
          and advisory services. Marrying pleasure with practicality, we empower
          customers to reduce costs while positively impacting the environment
          and combating water scarcity. Our cutting-edge technology enables
          real-time consumption tracking through a mobile application, including
          remote monitoring of plumbing systems.
        </p>
      </main>
    </>
  );
}

