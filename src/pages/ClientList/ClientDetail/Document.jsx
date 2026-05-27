import React from 'react';
import { Download, BadgeCheck } from 'lucide-react';
import ImageLoader from '../../../components/ui/ImageLoader';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';

const documents = [
  {
    id: 1,
    name: 'MSME certificate front.pdf',
    type: 'PDF',
    size: '1.20 MB',
    uploadedDate: '2026-01-10',
    verified: true,
  },
  {
    id: 2,
    name: 'MSME certificate back.pdf',
    type: 'PDF',
    size: '1.20 MB',
    uploadedDate: '2026-01-10',
    verified: true,
  },
  {
    id: 3,
    name: 'Business PAN card front.pdf',
    type: 'PDF',
    size: '450 KB',
    uploadedDate: '2026-01-11',
    verified: true,
  },
  {
    id: 4,
    name: 'Business PAN card back.pdf',
    type: 'PDF',
    size: '2.5 MB',
    uploadedDate: '2026-01-12',
    verified: true,
  },
];

const Documents = () => {
  return (
    <div className='p-5'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CDD0D1] pb-5'>
        <div>
          <h2 className='text-[18px] font-medium text-[#0B1C20 mb-0!'>
            Uploaded Documents
          </h2>

          <p className='text-[14px] text-[#818A8C] '>
            {documents.length} documents uploaded
          </p>
        </div>

        <div className='cursor-pointer'>
          <PrimaryButton
            label={'Download All'}
            iconLeft={'DownloadIcon'}
            // onNotify={handleCreateAgentPage}
          />
        </div>
      </div>

      <div className=''>
        {documents.map(doc => (
          <div
            key={doc.id}
            className='py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#CDD0D1] pr-30'
          >
            <div className='flex items-start gap-4'>
              <div className='flex items-center justify-center  shrink-0'>
                <ImageLoader imageKey='PdfIcons' className='w-10 h-10' />
              </div>

              <div>
                <h3 className='text-[16px] font-medium text-[#111827] break-all'>
                  {doc.name}
                </h3>

                <div className='flex flex-wrap items-center gap-2 mt-1 text-[14px] text-[#6A7174]'>
                  <span>{doc.type}</span>

                  <span>•</span>

                  <span>{doc.size}</span>

                  <span>•</span>

                  <span>Uploaded {doc.uploadedDate}</span>
                </div>
              </div>
            </div>

            {doc.verified && (
              <div className='flex items-center gap-2 bg-[#0F6177] text-white px-4 py-2 rounded-[50px] w-fit'>
                <ImageLoader imageKey='VerifiedIcon' />
                <span className='text-sm font-medium'>Verified</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
