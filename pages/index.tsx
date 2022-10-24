import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import SubNav from '../components/SubNav';
import {filler} from '../assets/images/images';

interface Company {
  id: string;
  attributes: {
    name: string;
    slug: string;
  };
}

const Home: NextPage = () => {
  const {data: session} = useSession();
  const {data: companies, isLoading: loadingCompanies} = useCompanies();

  useEffect(() => {
    if (session === null) {
      window.location.href = '/auth/signin';
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>

      <SubNav
        customHeading={
          <div className="flex items-center gap-6">
            <h1 className="text-grey text-xl font-medium">All companies</h1>
            <Link href="/add-company">
              <a className="flex items-center h-14 bg-white-200 px-5 rounded-lg text-body font-medium">
                Add a new company
              </a>
            </Link>
          </div>
        }
      />

      <section className="mt-14 grid grid-cols-2 gap-x-12">
        {loadingCompanies
          ? '...'
          : companies?.data?.map((company: Company) => (
              <Link
                href={`/companies/${company.attributes?.slug?.toLowerCase()}`}
                key={company.id}
              >
                <a>
                  <article className="flex flex-col gap-5 py-14">
                    <h2 className="text-md font-medium text-grey">
                      {company.attributes.name}
                    </h2>
                    <div className="relative">
                      <Image
                        alt="wise"
                        src={filler}
                        width={620}
                        height={411}
                        layout="responsive"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
                        className="rounded-2xl"
                      />
                    </div>
                  </article>
                </a>
              </Link>
            ))}
      </section>
    </>
  );
};

export default Home;

function useCompanies() {
  return useQuery(['companies'], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies`)
      .then(res => res.data),
  );
}
