
'use client';

import type { ProfessionalApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';
import type { Dictionary } from '@/lib/dictionary';
import { useState, useEffect } from 'react';

interface ProfessionalApprovalTableProps {
  dictionary: Dictionary['admin'];
}

const mockApplications: ProfessionalApplication[] = [
  { id: '1', fullName: 'Dr. Alice Smith', email: 'alice@example.com', specialization: 'Notary Public', documents: [{name: 'certificate.pdf', url:'#'}], status: 'pending', submittedAt: new Date(2023, 10, 15) },
  { id: '2', fullName: 'Bob Johnson Esq.', email: 'bob@example.com', specialization: 'Commercial Lawyer', documents: [{name: 'license.pdf', url:'#'}, {name:'id.jpg', url:'#'}], status: 'pending', submittedAt: new Date(2023, 10, 20) },
  { id: '3', fullName: 'Carol White', email: 'carol@example.com', specialization: 'Mediator', documents: [{name: 'cv.docx', url:'#'}], status: 'approved', submittedAt: new Date(2023, 9, 5) },
];


export default function ProfessionalApprovalTable({ dictionary }: ProfessionalApprovalTableProps) {
  const [applications, setApplications] = useState<ProfessionalApplication[]>([]);
  
  useEffect(() => {
    // Simulate fetching data - only show pending
    setApplications(mockApplications.filter(app => app.status === 'pending'));
  }, []);

  const handleApprove = (id: string) => {
    console.log(`Approving application ${id}`);
    // In a real app, update backend, then refresh or update local state
    setApplications(prev => prev.filter(app => app.id !== id)); 
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting application ${id}`);
    // In a real app, update backend, then refresh or update local state
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  if (applications.length === 0) {
    return <p className="text-muted-foreground">{dictionary.noPendingApprovals}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{dictionary.professionalName}</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>{dictionary.documents}</TableHead>
          <TableHead>{dictionary.status}</TableHead>
          <TableHead className="text-right">{dictionary.action}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.fullName}</TableCell>
            <TableCell>{app.email}</TableCell>
            <TableCell>{app.specialization}</TableCell>
            <TableCell>
              {app.documents.map(doc => (
                <Button variant="link" size="sm" key={doc.name} asChild className="p-0 h-auto">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    <FileText className="h-4 w-4" /> {doc.name}
                  </a>
                </Button>
              ))}
            </TableCell>
            <TableCell>
              <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'approved' ? 'default' : 'destructive'}>
                {app.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              {app.status === 'pending' && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => handleApprove(app.id)} aria-label={dictionary.approve}>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleReject(app.id)} aria-label={dictionary.reject}>
                    <XCircle className="h-5 w-5 text-red-600" />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
