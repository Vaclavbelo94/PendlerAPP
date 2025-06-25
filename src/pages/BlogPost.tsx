
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>Blog Post | PendlerApp</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Blog Post {id}</h1>
        <p className="text-muted-foreground">Blog post je v přípravě.</p>
      </div>
    </Layout>
  );
};

export default BlogPost;
