import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { NextPage } from 'next';

const Contact: NextPage = () => {
  return (
    <>
      <Title>Contact</Title>
      <Container className="pt-20">
        <h1 className="text-4xl font-bold">Contact</h1>
        <div className="mt-10 gap-10">
          <Card className="flex flex-col p-5 md:p-10">
            <h1>Customer Support</h1>
            <p className="grow text-xl font-normal">
              Got a question? Need assistance? We&apos;re here to help! Reach
              out to our dedicated customer support team via email, and
              we&apos;ll get back to you as soon as possible. Click the button
              below to reach out to us.
            </p>
            <div className="pt-2 align-bottom">
              <Button
                onClick={() => {
                  window.location.href = 'mailto:support@stats.fm';
                }}
              >
                Customer Support
              </Button>
            </div>
          </Card>
          <Card className="mt-10 flex flex-col p-5 md:p-10">
            <h1>Business, collaborations, hiring, and legal inquiries</h1>
            <p className="text-xl font-normal">
              For all business-related matters, collaboration proposals, hiring
              inquiries, and legal concerns, you can get in touch with us
              directly by clicking the button below.
            </p>
            <div className="pt-2 align-bottom">
              <Button
                onClick={() => {
                  window.location.href = 'mailto:biz@stats.fm';
                }}
              >
                Business
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default Contact;
