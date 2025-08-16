import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';

const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string(),
  description: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  industry: z.string().optional(),
  founded: z.number().optional(),
  headquarters: z.string().optional(),
  website: z.string().url().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Company = z.infer<typeof companySchema>;

export class CompaniesRepo {
  private readonly col = getFirestore().collection('companies');

  async getAll(): Promise<Company[]> {
    const snap = await this.col.orderBy('name').get();
    return snap.docs.map(d => companySchema.parse(d.data()));
  }

  async search(query: string): Promise<Company[]> {
    const snap = await this.col.orderBy('name').get();
    const companies = snap.docs.map(d => companySchema.parse(d.data()));
    
    const searchTerm = query.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm) ||
      company.description.toLowerCase().includes(searchTerm) ||
      company.industry?.toLowerCase().includes(searchTerm)
    );
  }

  async getById(id: string): Promise<Company | null> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) return null;
    return companySchema.parse(doc.data());
  }

  async getDesignations(): Promise<string[]> {
    // This would typically come from a separate designations collection
    // For now, return common frontend designations
    return [
      'Frontend Engineer',
      'Frontend Developer',
      'React Developer',
      'JavaScript Developer',
      'UI Developer',
      'Web Developer',
      'Frontend Lead',
      'Senior Frontend Engineer',
      'Staff Frontend Engineer',
    ];
  }
}
