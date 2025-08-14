import React, { useRef, useState } from 'react';
import NavBar from '../components/NavBar';
import { Button, Card, Tag, Modal, Input } from '@/components/ui';
import EditorShell from '../components/ui/EditorShell';

import { CodeEditor } from '@/components/ui';

export default function UIShowcase() {
  const [open, setOpen] = useState(false);
  const focusRef = useRef<HTMLButtonElement>(null);
  const [code, setCode] = useState(
    `export default function App(){\n  return (<div style={{padding:20}}><h1>Hello UI</h1></div>)\n}`
  );
  const [reactCode, setReactCode] = useState('');

  return (
    <div className='min-h-screen bg-bodyBg text-text'>
      <NavBar />
      <main className='max-w-6xl mx-auto px-6 py-10 space-y-10'>
        <section>
          <h2 className='text-2xl font-bold mb-4'>Buttons</h2>
          <div className='flex flex-wrap gap-3'>
            <Button>Primary</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='icon' aria-label='settings'>
              ⚙️
            </Button>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold mb-4'>Card & Tags</h2>
          <Card
            header={
              <div className='flex items-center justify-between'>
                <span className='font-semibold'>Two Sum</span>
                <Tag variant='success'>Easy</Tag>
              </div>
            }
            footer={
              <div className='flex items-center gap-2'>
                <Tag>Array</Tag>
                <Tag>HashMap</Tag>
              </div>
            }
          >
            <p className='text-sm text-neutral'>
              Given an array of integers nums and an integer target, return
              indices of the two numbers...
            </p>
          </Card>
        </section>

        <section>
          <h2 className='text-2xl font-bold mb-4'>Modal</h2>
          <Button onClick={() => setOpen(true)} ref={focusRef}>
            Open Modal
          </Button>
          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            title='Create Workspace'
          >
            <div className='space-y-4'>
              <Input label='Name' placeholder='Workspace name' />
              <div className='flex justify-end gap-2 pt-2'>
                <Button variant='secondary' onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button>Create</Button>
              </div>
            </div>
          </Modal>
        </section>

        <section>
          <h2 className='text-2xl font-bold mb-4'>Editor Shell (Sandpack)</h2>
          <EditorShell title='index.tsx'>
            <CodeEditor code={code} onChange={setCode} mode='sandpack' />
          </EditorShell>
        </section>

        <section>
          <h2 className='text-2xl font-bold mb-4'>
            Full React Environment (Sandpack)
          </h2>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-semibold mb-2'>
                Complete React Development Environment
              </h3>
              <p className='text-text/70 mb-4'>
                Full-featured React environment with file explorer, multiple
                components, live preview, and console. Includes pre-built
                components like Welcome and Counter with full React patterns.
              </p>
              <div className='h-screen'>
                <CodeEditor
                  code={reactCode}
                  onChange={setReactCode}
                  theme='dark'
                />
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-2'>Features Included</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-primary'>
                    Editor Features:
                  </h4>
                  <ul className='space-y-1 text-text/70'>
                    <li>• File Explorer with multiple files</li>
                    <li>• Syntax highlighting & autocomplete</li>
                    <li>• Error detection & inline errors</li>
                    <li>• Auto-run with instant updates</li>
                    <li>• Full window height optimization</li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-primary'>
                    React Environment:
                  </h4>
                  <ul className='space-y-1 text-text/70'>
                    <li>• React 18 with hooks</li>
                    <li>• Component composition</li>
                    <li>• State management examples</li>
                    <li>• Event handling patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
