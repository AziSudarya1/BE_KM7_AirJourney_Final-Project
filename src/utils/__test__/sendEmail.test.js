import { jest } from '@jest/globals';
import Handlebars from 'handlebars';

const mockSendMail = jest.fn().mockResolvedValue('Mock email sent');
const mockReadFileSync = jest.fn();

jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: () => ({
      sendMail: mockSendMail
    })
  }
}));

jest.unstable_mockModule('fs', () => ({
  default: {
    readFileSync: mockReadFileSync
  }
}));

jest.unstable_mockModule('../env.js', () => ({
  appEnv: {
    EMAIL_ADDRESS: 'mock@example.com',
    EMAIL_PASSWORD: 'mockpassword'
  }
}));

const { sendEmail } = await import('../email/mail.js');
const { appEnv } = await import('../env.js');

describe('Email Utility Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockReadFileSync.mockImplementation((filePath) => {
      if (filePath.includes('.html')) {
        return '<html>{{name}}</html>';
      }
      throw new Error(`ENOENT: no such file or directory, open '${filePath}'`);
    });

    Handlebars.compile = jest.fn((template) => {
      return (data) => template.replace('{{name}}', data.name);
    });
  });

  it('should send an email with the correct parameters', async () => {
    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const fileName = 'otp';
    const payload = { name: 'Recipient Name' };

    await sendEmail(to, subject, fileName, payload);

    expect(mockReadFileSync).toHaveBeenCalledWith(
      expect.stringContaining('otp.html'),
      'utf8'
    );

    expect(Handlebars.compile).toHaveBeenCalledWith('<html>{{name}}</html>');

    expect(mockSendMail).toHaveBeenCalledWith({
      from: appEnv.EMAIL_ADDRESS,
      to,
      subject,
      html: '<html>Recipient Name</html>'
    });
  });

  it('should throw an error if template file is missing', async () => {
    mockReadFileSync.mockImplementationOnce(() => {
      throw new Error('ENOENT: no such file or directory');
    });

    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const fileName = 'missing-template';
    const payload = { name: 'Recipient Name' };

    await expect(sendEmail(to, subject, fileName, payload)).rejects.toThrow(
      'ENOENT: no such file or directory'
    );
  });
});
